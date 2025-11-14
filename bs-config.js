const path = require("path");
const fs = require("fs/promises")
const sass = require("sass")

/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
    watch: true,
    files: [
        // reload browser when files in dist/ change
        "dist/*",
        {
            // rebuild files in src/ when source files change
            match: ["src/*.html", "src/*.scss"],
            fn:  async function (event, file) {
                if (event === "change") {
                    if (path.extname(file) === '.html')
                        await fs.copyFile(file, "dist/" + path.basename(file))
                    else if (path.extname(file) === '.scss') {
                        // await sass.render({file, outFile: 'dist/otter.css' })
                        const result = await sass.compileAsync(file, { style: "expanded", sourceMap: true })
                        await fs.writeFile("dist/main.css", result.css)
                        await fs.writeFile("dist/main.css.map", JSON.stringify(result.sourceMap))
                    }
                }
            }
        }
    ],
    server: "dist"
}