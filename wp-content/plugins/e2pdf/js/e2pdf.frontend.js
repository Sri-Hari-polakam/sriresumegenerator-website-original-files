var e2pdf = {
    updateViewArea: function (pdfIframe, listener) {
        if (pdfIframe.hasClass('e2pdf-pages-loaded') && pdfIframe.hasClass('e2pdf-responsive')) {
            var pdfIframeContents = pdfIframe.contents();
            if (pdfIframe.hasClass('e2pdf-responsive-page')) {
                var viewerHeight = parseInt(pdfIframeContents.find('#viewer .page').first().outerHeight());
            } else {
                var viewerHeight = parseInt(pdfIframeContents.find('#viewer').outerHeight());
            }
            var viewerContainerTop = parseInt(pdfIframeContents.find('#viewerContainer').offset().top);
            pdfIframe.innerHeight(viewerHeight + viewerContainerTop + 2);

            if (!pdfIframe.hasClass('e2pdf-responsive-page')) {
                pdfIframeContents.find('#viewerContainer').scrollTop(0);
            }
        }

        if (listener == 'pagesloaded') {
            var pdfIframeContents = pdfIframe.contents();
            pdfIframeContents.find('#viewerContainer').scrollTop(0);
        }
    },
    viewSinglePageSwitch: function (pdfIframe, page) {
        if (pdfIframe.hasClass('e2pdf-single-page-mode') && pdfIframe.hasClass('e2pdf-responsive')) {
            var page = parseInt(page);
            if (page) {
                var pdfIframeContents = pdfIframe.contents();
                pdfIframeContents.find('.page').not('.page[data-page-number="' + page + '"]').css({'position': 'absolute', 'visibility': 'hidden', 'z-index': '-1'});
                pdfIframeContents.find('.page[data-page-number="' + page + '"]').css({'position': 'relative', 'visibility': '', 'z-index': ''});
            }
        }
    },
    viewerOnLoad: function (iframe) {
        var pdfIframe = jQuery(iframe);
        var pdfIframeContents = pdfIframe.contents();
        pdfIframe.addClass('e2pdf-view-loaded');
        pdfIframeContents.find('html').addClass('e2pdf-view-loaded');

        if (iframe.contentWindow && iframe.contentWindow.PDFViewerApplication) {
            
            iframe.contentWindow.PDFViewerApplication.initializedPromise.then(function () {
                iframe.contentWindow.PDFViewerApplication.eventBus.on("pagesloaded", function (event) {
                    pdfIframe.addClass('e2pdf-pages-loaded');
                    pdfIframeContents.find('html').addClass('e2pdf-pages-loaded');
                    e2pdf.viewSinglePageSwitch(pdfIframe, 1);
                    e2pdf.updateViewArea(pdfIframe, 'pagesloaded');
                });

                iframe.contentWindow.PDFViewerApplication.eventBus.on("pagechanging", function (event) {
                    if (event && event.pageNumber) {
                        e2pdf.viewSinglePageSwitch(pdfIframe, event.pageNumber);
                        e2pdf.updateViewArea(pdfIframe, 'pagechanging');
                    }
                });

                var listeners = [
                    'scalechanging',
                    'scalechanged',
                    'rotationchanging',
                    'updateviewarea',
                    'scrollmodechanged',
                    'spreadmodechanged',
                    'pagechanging',
                    'zoomin',
                    'zoomout',
                    'zoomreset',
                    'nextpage',
                    'previouspage'
                ];
                listeners.forEach(function (listener) {
                    iframe.contentWindow.PDFViewerApplication.eventBus.on(listener, function (event) {
                        e2pdf.updateViewArea(pdfIframe, listener);
                    });
                });
            });
        } else {
            pdfIframeContents[0].addEventListener('pagesloaded', function (event) {
                pdfIframe.addClass('e2pdf-pages-loaded');
                pdfIframeContents.find('html').addClass('e2pdf-pages-loaded');
                e2pdf.viewSinglePageSwitch(pdfIframe, 1);
                e2pdf.updateViewArea(pdfIframe, 'pagesloaded');
            });

            pdfIframeContents[0].addEventListener('pagechanging', function (event) {
                if (event && event.detail && event.detail.pageNumber) {
                    e2pdf.viewSinglePageSwitch(pdfIframe, event.detail.pageNumber);
                    e2pdf.updateViewArea(pdfIframe, 'pagechanging');
                }
            });

            var listeners = [
                'scalechanging',
                'scalechanged',
                'rotationchanging',
                'updateviewarea',
                'scrollmodechanged',
                'spreadmodechanged',
                'pagechanging',
                'zoomin',
                'zoomout',
                'zoomreset',
                'nextpage',
                'previouspage'
            ];
            listeners.forEach(function (listener) {
                pdfIframeContents[0].addEventListener(listener, function (event) {
                    e2pdf.updateViewArea(pdfIframe, listener);
                });
            });
        }
    }
};



jQuery(document).ready(function () {
    if (jQuery('.e2pdf-download.e2pdf-auto').not('.e2pdf-iframe-download').length > 0) {
        jQuery('.e2pdf-download.e2pdf-auto').not('.e2pdf-iframe-download').each(function () {
            if (jQuery(this).hasClass('e2pdf-inline')) {
                window.open(jQuery(this).attr('href'), '_blank');
            } else {
                location.href = jQuery(this).attr('href');
            }
        });
    }
});