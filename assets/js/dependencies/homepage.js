$(function () {
    $('#home-form').submit(function (evt) {
        console.log(evt);
        var $this = $(evt.target);
        evt.preventDefault();
        console.log(this);
        $this.find('button').button('loading');
        var url = this.website.value;
        console.log(url);
        if (url) {
            if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
                url = 'http://' + url;
            }
            $.ajax({
                url: '/api/crawler/meta', data: {url: url}, success: function (data) {
                    $this.find('button').button('reset');
                    if (data && !data.errors) {
                        console.log(data);
                    }
                }
            });
        }
        return false;
    });


});