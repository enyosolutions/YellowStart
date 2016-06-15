module.exports = {


    bookmarkStats: function () {

        var userCollection = Monk.get('user');
        var startupCollection = Monk.get('user');


        setInterval(function () {
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
                        startupCollection.update({_id: results[i]._id}, {$set: {'meta.bookmarks': results[i].count}}).error(function (err) {
                            console.log(err);
                        });
                    }
                }
            );

        }, 60000);
    }
};