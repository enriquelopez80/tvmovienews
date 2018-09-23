$("#scraper").on('click', function () {

    $.get("/scrape", function (data) {
        console.log(data)
    });

    $.getJSON("/articles", function (data) {

        data.forEach(article => {

            $("#articles").append(`
                <h2>
                Article: ${article.title} </h2>
                <h3> Excerpt: ${article.excerpt} </h3>
                <h4><a href="${article.link}">Link to article</a></h4>
                <div>Comment: 
                <form><textarea id="comment"></textarea>
                <button class="uk-button uk-button-default" id="save" data-id=${article._id}>Save</button></form>
                </div>
                <div class="commentbox">
                <p>${article.comment}</p>
                </div>
                 `)

        });

    });

});

$(document).on('click', "#save", function (e) {

    e.preventDefault();

    let thisId = $(this).data("id");

    console.log(thisId)

    let comment = $(this).prev().val().trim();

    console.log(comment)

    $.ajax({
            method: "POST",
            url: "/submit/" + thisId,
            data: {
                body: comment
            }
        })
        .then(function (data) {
            // Log the response
            console.log(data);
            $("#comment").empty();
        });

})