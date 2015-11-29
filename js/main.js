$(function() {

    $('#gallery').each(function() {

        var $container = $(this),
            $loadMoreButton = $('#load-more'),
            $filter = $('gallery-filter'),
            addItemCount = 12, //一次加了12張圖
            allData = [], //全部有幾張圖
            filteredData = [], //過濾後的資料
            added = 0;

        $container.masonry({
            columnWidth: 230,
            gutter: 10,
            itemSelector: '.gallery-item'
        });

        $.getJSON('./data/content.json', initGallery);

        function initGallery(data) {

            // 把getJSON的資料存在變數allData中
            allData = data;

            // 預設不篩選資料
            filteredData = allData;

            // 把要顯示的圖片加入Gallery
            addItems();

            // 當按了Load More Button 就加入新的項目
            $loadMoreButton.on('click', addItems);

            // 當篩選的選項改變的時候，就過濾要顯示的項目
            $filter.on('change', 'input[type="radio"]', filterItems);

        }

        function addItems(filter) {
            var elements = [],
                //從added的地方，到added + addItemCount的圖片把它存起來
                //因為一次只能顯示addItemCount個圖片
                slicedData = filteredData.slice(added, added + addItemCount);
            $.each(slicedData, function(i, item) {

                var itemHTML =
                    '<li class="gallery-item is-loading">' +
                    '<a href="' + item.images.large + '">' +
                    '<img src="' + item.images.thumb + '" alt="">' +
                    '<span class="caption">' +
                    '<span class="inner">' +
                    '<b class="title">' + item.title + '</b>' +
                    '</a>' +
                    '</li>';
                elements.push($(itemHTML).get(0));
            });

            $container.append(elements);

            added += slicedData.length;

            if (added < filteredData.length)
                $loadMoreButton.show();
            else
                $loadMoreButton.hide();

        }

        function filterItems() {

            var key = $(this).val(), //radio button被選中的值, all, people, animals
                masonryItems = $container.masonry('getItemElements');

            $container.masonry('remove', masonryItems);

            filteredData = [];
            added = 0;
            if (key === 'all') {
                filteredData = all;
            } else {
                //
                filteredData = $.grep(allData, function(item) {
                    return item.category === key;
                });
                // for(var index = 0; index < allData.length; ++index){
                // 	if(allData[index].category === key)
                // 		filteredData.push(allData[index]);
                // }
            }

            addItems(true);

        }


    });

});
