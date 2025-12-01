import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
    // silenzia warning bootstrap-italia
    sassOptions: {
        silenceDeprecations: [
            'import',
            'global-builtin',
            'color-functions',
            'abs-percent',
            'slash-div',
            'function-units'
        ],
    },
    // fix per collegamento bootstrap-italia
    webpack: (config) => {
        config.resolve.alias['@splidejs/splide/src/css/core/index'] =
            path.resolve(
                __dirname,
                'node_modules/@splidejs/splide/dist/css/splide-core.min.css'
            )

        return config
    }
}

export default nextConfig
