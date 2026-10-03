// Vue 3 Composition API Setup
const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        // Reactive States
        const isMenuOpen = ref(false);
        const selectedCategory = ref('全部商品');
        const quickViewProduct = ref(null);

        // Categories Definition
        const navCategories = ['全部商品', '外套/長褲', '足球/排球', '籃球衣'];

        // 1. 自動嘗試切換副檔名的圖片載入失敗處理函式
        const handleImageError = (event) => {
            const img = event.target;
            if (img.dataset.hasRetried) return; // 避免無限循環
            img.dataset.hasRetried = 'true';

            // 判斷原檔名是 png 還是 jpg（不分大小寫）並嘗試備援替換
            if (/\.png$/i.test(img.src)) {
                img.src = img.src.replace(/\.png$/i, '.jpg');
            } else if (/\.jpg$/i.test(img.src)) {
                img.src = img.src.replace(/\.jpg$/i, '.png');
            }
        };

        // 2. 自動產生「足球/排球」項目的函式 (IMG_0929 到 IMG_0968)
        const generateSoccerVolleyballProducts = (startId) => {
            const list = [];
            let currentId = startId;
            for (let i = 929; i <= 968; i++) {
                list.push({
                    id: currentId++,
                    name: `無向運動 足球/排球 (${i})`,
                    category: '足球/排球',
                    price: 850,
                    tag: '',
                    image: `assets/img/products/無向運動_足球-排球/IMG_0${i}.PNG`
                });
            }
            return list;
        };

        // 3. 自動產生「籃球衣」項目的函式 (統一為小寫 .png)
        // 範圍：0336~0373 與 0392~0404 (跳過缺號 0357、0396)
        const generateBasketballProducts = (startId) => {
            const list = [];
            let currentId = startId;
            const skipIds = [357, 396]; // 排除缺號[cite: 3]

            const ranges = [
                { start: 336, end: 373 },
                { start: 392, end: 404 } // 截圖新增的區段[cite: 3]
            ];

            for (const range of ranges) {
                for (let i = range.start; i <= range.end; i++) {
                    if (skipIds.includes(i)) continue; // 跳過缺號[cite: 3]

                    list.push({
                        id: currentId++,
                        name: `無向運動 籃球衣 (0${i})`,
                        category: '籃球衣',
                        price: 980,
                        tag: i === 336 ? '隊服客製' : '',
                        image: `assets/img/products/無向運動_籃球衣/IMG_0${i}.png` // 更改為小寫 .png
                    });
                }
            }
            return list;
        };

        // Product Data Source
        const products = ref([
            // --------------------------------------------------
            // 分類：外套/長褲
            // --------------------------------------------------
            { id: 1, name: '無向運動 外套/長褲 (0321)', category: '外套/長褲', price: 1280, tag: '熱銷推薦', image: 'assets/img/products/無向運動_外套&長褲/IMG_0321.JPG' },
            { id: 2, name: '無向運動 外套/長褲 (0322)', category: '外套/長褲', price: 1280, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0322.JPG' },
            { id: 3, name: '無向運動 外套/長褲 (0323)', category: '外套/長褲', price: 1280, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0323.JPG' },
            { id: 4, name: '無向運動 外套/長褲 (0324)', category: '外套/長褲', price: 1280, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0324.JPG' },
            { id: 5, name: '無向運動 外套/長褲 (0325)', category: '外套/長褲', price: 1280, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0325.JPG' },
            { id: 6, name: '無向運動 外套/長褲 (0374)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0374.JPG' },
            { id: 7, name: '無向運動 外套/長褲 (0375)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0375.JPG' },
            { id: 8, name: '無向運動 外套/長褲 (0376)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0376.JPG' },
            { id: 9, name: '無向運動 外套/長褲 (0377)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0377.JPG' },
            { id: 10, name: '無向運動 外套/長褲 (0378)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0378.JPG' },
            { id: 11, name: '無向運動 外套/長褲 (0379)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0379.JPG' },
            { id: 12, name: '無向運動 外套/長褲 (0380)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0380.JPG' },
            { id: 13, name: '無向運動 外套/長褲 (0381)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0381.JPG' },
            { id: 14, name: '無向運動 外套/長褲 (0382)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0382.JPG' },
            { id: 15, name: '無向運動 外套/長褲 (0383)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0383.JPG' },
            { id: 16, name: '無向運動 外套/長褲 (0384)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0384.JPG' },
            { id: 17, name: '無向運動 外套/長褲 (0385)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0385.JPG' },
            { id: 18, name: '無向運動 外套/長褲 (0386)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0386.JPG' },
            { id: 19, name: '無向運動 外套/長褲 (0387)', category: '外套/長褲', price: 1180, tag: '', image: 'assets/img/products/無向運動_外套&長褲/IMG_0387.PNG' },

            // --------------------------------------------------
            // 分類：籃球衣 (包含首張長檔名 + 0336 至 0373 自動生成)
            // --------------------------------------------------
            ...generateBasketballProducts(21),

            // --------------------------------------------------
            // 分類：足球/排球 (透過迴圈自動生成 id 31 ~ 70)
            // --------------------------------------------------
            ...generateSoccerVolleyballProducts(31)
        ]);

        // Filtered products computed based on selected category
        const filteredProducts = computed(() => {
            if (selectedCategory.value === '全部商品') {
                return products.value;
            }
            return products.value.filter(p => p.category === selectedCategory.value);
        });

        // Interaction Handlers
        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
        };

        const filterCategory = (cat) => {
            selectedCategory.value = cat;
        };

        const openQuickView = (product) => {
            quickViewProduct.value = product;
        };

        return {
            isMenuOpen,
            selectedCategory,
            navCategories,
            products,
            filteredProducts,
            quickViewProduct,
            toggleMenu,
            filterCategory,
            openQuickView,
            handleImageError
        };
    }
}).mount('#app');