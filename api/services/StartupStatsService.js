module.exports = {


    bookmarkStats: function () {
        var userCollection = Monk.get('user');
        var startupCollection = Monk.get('startup');
        console.log('[META] importing bookmarks routine started.');
        setInterval(function () {
            console.log('[META] importing bookmarks data.');
            userCollection.col.aggregate([
                    {$project: {bookmarks: 1}},
                    {$unwind: "$bookmarks"},
                    {
                        $group: {
                            _id: "$bookmarks",
                            count: {$sum: 1}
                        }
                    }
                ], {}, function (err, results) {
                    for (var i in results) {
                        startupCollection.findAndModify({_id: (results[i]._id)}, {$set: {'meta.bookmarks': results[i].count}})
                            .success(function (out) {
                            console.log(out);
                        })
                            .error(function (err) {
                                console.warn(err);
                            });
                    }
                }
            );

        }, 120000);

    }
};