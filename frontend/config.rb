# Require any additional compass plugins here.
require 'bootstrap-sass'

# Set this to the root of your project when deployed:
http_path = "/"

sass_dir = "src/scss"
css_dir = "../app/assets/css"

images_dir = "../app/assets/img"
fonts_dir = "../app/assets/fonts"
javascripts_dir = "../app/assets/js"

# Output sourcemaps
sourcemap = true

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = :nested

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass scss scss && rm -rf sass && mv scss sass
