import test from 'node:test';
import assert from 'node:assert/strict';
import { campaignFromSearch, validateContact, toExistingRecord, createRestSubmitter,
  createSupabaseSubmitter, EARLY_ACCESS_URL } from '../site/assets/submission.mjs';
const input = { email: '  Person+review@Example.com ', full_name: '  Sam O’Connor  ', campaign: 'investor-deck' };
const apiKey = 'sb_publishable_local_test_only';
function adapter(response, inspect) {
  return createRestSubmitter({ apiKey, fetchImpl: async (url,options) => {
    inspect?.(url,options); return response;
  } });
}

test('email is required, name is optional', () => {
  assert.equal(validateContact({email:''}).valid,false);
  assert.equal(validateContact({email:'person@example.com'}).valid,true);
});
test('invalid email, excessive length and name control characters are rejected', () => {
  for (const email of ['bad','a@','a b@example.com','a@b','x'.repeat(250)+'@example.com']) {
    assert.equal(validateContact({email}).valid,false,email);
  }
  assert.equal(validateContact({email:'a@b.com',full_name:'a'.repeat(121)}).valid,false);
  assert.equal(validateContact({email:'a@b.com',full_name:'a\nb'}).valid,false);
});
test('one-word and international names are accepted', () => {
  for (const full_name of ['Sam','María-José','李明','O’Connor']) assert.equal(validateContact({email:'a@b.com',full_name}).valid,true);
});
test('exact existing insert schema and source policy retained', () => {
  assert.deepEqual(toExistingRecord(input), {
    email:'person+review@example.com',full_name:'Sam O’Connor',source:'holding_page',utm:{source:'investor-deck',experience:'netlify-preview-v3'}
  });
  assert.equal(toExistingRecord({email:'a@b.com'}).full_name,null);
});
test('only low-cardinality campaign values are retained', () => {
  assert.equal(campaignFromSearch('?source=investor-deck&email=private@example.com'),'investor-deck');
  assert.equal(campaignFromSearch('?source=person@example.com'),'website');
  assert.equal(campaignFromSearch('?source=partner-referral'),'partner-referral');
  assert.equal(campaignFromSearch(''),'website');
});
test('201 uses POST, minimal return and credentials omitted', async () => {
  const signal=new AbortController().signal;
  const fn=adapter(new Response(null,{status:201}),(url,options)=>{
    assert.equal(url,`${EARLY_ACCESS_URL}/rest/v1/early_access`);
    assert.equal(options.method,'POST');assert.equal(options.credentials,'omit');
    assert.equal(options.headers.Prefer,'return=minimal');assert.equal(options.headers.Authorization,undefined);
    assert.equal(options.referrerPolicy,'no-referrer');assert.equal(options.signal,signal);
    assert.deepEqual(JSON.parse(options.body),toExistingRecord(input));
  });
  assert.deepEqual(await fn(input,{signal}),{ok:true});
});
test('204 is a successful minimal response',async()=>{
 assert.deepEqual(await adapter(new Response(null,{status:204}))(input),{ok:true});
});
test('duplicate returns the same UI success without read or overwrite',async()=>{
 assert.deepEqual(await adapter(Response.json({code:'23505'},{status:409}))(input),{ok:true});
});
test('other conflict, RLS denial, missing table and service outage are not success',async()=>{
 for (const status of [400,401,403,404,409,500,503]) {
   await assert.rejects(adapter(Response.json({code:'other'},{status}))(input));
 }
});
test('200 generic HTML page is not mistaken for a save',async()=>{
 await assert.rejects(adapter(new Response('<html>Fallback page</html>',{status:200}))(input));
});
test('rate limiting gets a specific retry message',async()=>{
 await assert.rejects(adapter(new Response('',{status:429}))(input),/wait a moment/);
});
test('network failure is propagated',async()=>{
 const fn=createRestSubmitter({apiKey,fetchImpl:async()=>{throw new TypeError('network');}});
 await assert.rejects(fn(input),/network/);
});
test('missing or secret key and wrong project fail before any request',()=>{
 assert.throws(()=>createRestSubmitter({apiKey:''}));
 assert.throws(()=>createRestSubmitter({apiKey:'sb_secret_do_not_use'}));
 assert.throws(()=>createRestSubmitter({apiKey,url:'https://etmmuzwxtcjipwphdola.supabase.co'}));
 assert.throws(()=>createRestSubmitter({apiKey,url:'https://evil.example'}));
});
test('legacy anon supported but service_role rejected',async()=>{
 const jwt=role=>'eyJhbGciOiJIUzI1NiJ9.'+Buffer.from(JSON.stringify({role})).toString('base64url')+'.unused';
 assert.throws(()=>createRestSubmitter({apiKey:jwt('service_role')}));
 const key=jwt('anon');
 const fn=createRestSubmitter({apiKey:key,fetchImpl:async(u,o)=>{
  assert.equal(o.headers.Authorization,`Bearer ${key}`);return new Response(null,{status:201});
 }});assert.deepEqual(await fn(input),{ok:true});
});
test('SDK adapter inserts into existing table without select',async()=>{
 let calls=0;
 const client={from(table){ assert.equal(table,'early_access'); return {insert(payload){calls++;assert.deepEqual(payload,toExistingRecord(input));return Promise.resolve({error:null});}};}};
 assert.deepEqual(await createSupabaseSubmitter(client)(input),{ok:true});assert.equal(calls,1);
});
test('SDK duplicate succeeds; other errors reject',async()=>{
 const client=code=>({from(){return {insert(){return Promise.resolve({error:{code}});}};}});
 assert.deepEqual(await createSupabaseSubmitter(client('23505'))(input),{ok:true});
 await assert.rejects(createSupabaseSubmitter(client('42501'))(input));
});
test('SDK abort never displays success',async()=>{
 const abort=new AbortController();abort.abort();let called=false;
 const client={from(){called=true;return {insert(){return Promise.resolve({error:null});}};}};
 await assert.rejects(createSupabaseSubmitter(client)(input,{signal:abort.signal}));assert.equal(called,false);
});
