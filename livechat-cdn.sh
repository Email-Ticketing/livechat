while getopts b: flag
do
    case "${flag}" in
        b) branch=${OPTARG};;
    esac
done

echo "Syncing livechat repo on branch $branch"

cd livechat

git checkout $branch

git fetch --all
git reset --hard origin/$branch

npm install

echo "Disabling hashes in webpack config"

# Replace hash from JS
sed -i 's#static/js/[name].[contenthash:8].chunk.js#static/js/[name].chunk.js#g' ./node_modules/react_scripts/config/webpack.config.js

# Replace hash from CSS
sed -i 's#static/css/[name].[contenthash:8].css#static/js/[name].chunk.js#g' ./node_modules/react_scripts/config/webpack.config.js

echo "Building livechat on branch $branch"

npm run build

sudo systemctl restart nginx

