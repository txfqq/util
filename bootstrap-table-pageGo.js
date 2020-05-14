(function ($) {

    var sprintf = function (str) {
        var args = arguments,
            flag = true,
            i = 1;

        str = str.replace(/%s/g, function () {
            var arg = args[i++];

            if (typeof arg === 'undefined') {
                flag = false;
                return '';
            }
            return arg;
        });
        return flag ? str : '';
    };

    $.extend($.fn.bootstrapTable.defaults, {
        // 默认不显示
        showPageGo: false
    });
    $.extend($.fn.bootstrapTable.locales, {

        formatPageGo: function() {
            return "跳转"
        }
    });

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);
    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initPagination = BootstrapTable.prototype.initPagination;

    // 扩展已有的初始化分页组件的方法
    BootstrapTable.prototype.initPagination = function() {
        _initPagination.apply(this, Array.prototype.slice.apply(arguments));
        if (this.options.showPageGo) {
            var that = this,
                $pagination = this.$pagination.find("ul.pagination"),
                $pageGo = $pagination.find("li.pageGo");
            if (!$pageGo.length) {
                $pageGo = $(['<li class="pageGo">',
                        sprintf('<input type="text" class="form-control  page-input" value="%s">',
                        this.options.pageNumber),
                        '<button class="btn' + sprintf(" btn-%s", this.options.buttonsClass)
                        + sprintf(" btn-%s", this.options.iconSize)
                        + '" title="' + this.options.formatPageGo() + '" '
                        + ' type="button">' + this.options.formatPageGo(), "</button>", "</li>"].join("")
                        ).appendTo($pagination);

                //  this.$pagination.find('ul.pagination').after(html.join(''));

                // // 点击按钮触发跳转到指定页函数
                //             this.$pagination.find('button').off('click').on('click', $.proxy(this.onPageGo, this));
                // // 自定义跳转到某页的函数
                // BootstrapTable.prototype.onPageGo = function (event) {
                //     // 获取手动输入的要跳转到的页码元素
                //     var $toPage=this.$pagination.find('.page-input');
                //     // 当前页不做处理
                //     if (this.options.pageNumber === +$toPage.val()) {
                //         return false;
                //     }
                //     // 调用官方的函数
                //     this.selectPage(+$toPage.val());
                //     return false;
                // };

                // 手动输入页码校验，只允许输入正整数
                this.$pagination.find('.page-input').off('keyup').on('keyup', function(){
                    this.value = this.value.length == 1 ? this.value.replace(/[^1-9]/g,'') : this.value.replace(/\D/g,'');
                });


                $pageGo .find("button").off('click').click(function() {
                    var pageGo = parseInt($pageGo.find("input").val()) || 1;
                    if (pageGo < 1 || pageGo > that.options.totalPages) {
                        pageGo = 1
                    }
                    // 当前页不做处理
                    if (that.options.pageNumber === pageGo) {
                        return false;
                    }

                    that.selectPage(pageGo)
                })
            }

        }

    };

})(jQuery);

