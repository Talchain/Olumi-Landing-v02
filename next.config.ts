import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            },
          },
        ],
      },
      {
        test: /\.(glb|gltf)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(pic|hdr)$/,
        use: {
          loader: 'file-loader',
          options: {
            publicPath: `/_next/static/pics`,
            outputPath: `static/pics/`,
          },
        },
      },
    )
    return config
  },
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: 'false',
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: ['cdn.sanity.io'],
  },
  sassOptions: {
    api: 'modern',
    silenceDeprecations: ['mixed-decls', 'legacy-js-api'],
  },
}

export default nextConfig
