while getopts b: flag
do
    case "${flag}" in
        b) branch=${OPTARG};;
    esac
done

echo "Syncing livechat repo on branch $branch"

cd livechat



git fetch --all
git checkout $branch
git reset --hard origin/$branch

npm install

chmod -R 777 node_modules

echo "Disabling hashes in webpack config"

# Replace hash from JS
sed -i 's#static/js/\[name\]\.\[contenthash:8\]\.js#static/js/\[name\]\.js#g' ./node_modules/react-scripts/config/webpack.config.js
# Replace hash from CSS
sed -i 's#static/css/\[name\]\.\[contenthash:8\]\.css#static/css/\[name\]\.css#g' ./node_modules/react-scripts/config/webpack.config.js

echo "Building livechat on branch $branch"

npm run build

sudo systemctl restart nginx
