// Vue 3 Composition API Setup
const { createApp, ref, computed } = Vue;

createApp({
    setup() {
        // Reactive States
        const isMenuOpen = ref(false);
        const selectedCategory = ref('全部商品');
        const quickViewProduct = ref(null);

        // Categories Definition
        const navCategories = ['全部商品', '熱昇華套裝', '熱昇華足/排球衣', '熱昇華籃球衣'];

        // 隱藏載入失敗（沒圖）的商品 ID 集合
        const missingImageProductIds = ref(new Set());

        // 1. 自動嘗試切換副檔名的圖片載入失敗處理函式
        const handleImageError = (event, productId) => {
            const img = event.target;
            
            // 第一階段：如果 .png 載入失敗，先嘗試切換成 .jpg（或反之）
            if (!img.dataset.hasRetried) {
                img.dataset.hasRetried = 'true';
                if (img.src.endsWith('.png')) {
                    img.src = img.src.replace(/\.png$/, '.jpg');
                    return;
                } else if (img.src.endsWith('.jpg')) {
                    img.src = img.src.replace(/\.jpg$/, '.png');
                    return;
                }
            }

            // 第二階段：如果切換副檔名後依然讀不到圖片，說明真的沒圖了，將該商品隱藏
            if (productId) {
                missingImageProductIds.value.add(productId);
            }
        };

        // 2. 通用自動產生商品函式（從 1 開始編號，前面不補 0）
        const generateProducts = ({ category, folderPath, defaultExt = 'png', startId, maxTry = 100 }) => {
            const list = [];
            let currentId = startId;

            // 從 1 開始迴圈：1, 2, 3...
            for (let i = 1; i <= maxTry; i++) {
                list.push({
                    id: currentId++,
                    name: `無向運動 ${category} (${i})`,
                    category: category,
                    image: `${folderPath}${i}.${defaultExt}`
                });
            }
            return list;
        };

        // Product Data Source（路徑已依截圖更新）
        const products = ref([
            // 分類：熱昇華套裝 (1.jpg ~ )
            ...generateProducts({
                category: '熱昇華套裝',
                folderPath: 'assets/img/products/product_outerwear/',
                defaultExt: 'jpg',
                startId: 1
            }),

            // 分類：熱昇華籃球衣 (1.png ~ )
            ...generateProducts({
                category: '熱昇華籃球衣',
                folderPath: 'assets/img/products/product_basketball/',
                defaultExt: 'png',
                startId: 200
            }),

            // 分類：熱昇華足/排球衣 (1.png ~ )
            ...generateProducts({
                category: '熱昇華足/排球衣',
                folderPath: 'assets/img/products/product_volleyball_soccer/',
                defaultExt: 'png',
                startId: 400
            })
        ]);

        // Filtered products: 依選擇分類進行篩選，並自動排除「沒有圖片」的商品
        const filteredProducts = computed(() => {
            return products.value.filter(p => {
                const matchesCategory = selectedCategory.value === '全部商品' || p.category === selectedCategory.value;
                const hasImage = !missingImageProductIds.value.has(p.id);
                return matchesCategory && hasImage;
            });
        });

        // Interaction Handlers
        const toggleMenu = () => {
            isMenuOpen.value = !isMenuOpen.value;
        };

        const filterCategory = (cat) => {
            selectedCategory.value = cat;

            // 切換分類後平滑滾動回頁面最頂端
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // 平滑滾動效果
            });
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