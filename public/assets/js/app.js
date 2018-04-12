$("#scrapeBtn").on("click", () => {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function (data) {
        console.log(data)
        window.location = "/"
    })
});

$(".save").on("click", function () {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done((data) => {
        window.location = "/"
    });
});

$(".delete").on("click", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function (data) {
        window.location = "/saved"
    });
});


$(".save-note").on("click", function () {
    var thisId = $(this).attr("data-id");
    var noteContent = $("#noteArea").val();
    console.log(noteContent);
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: noteContent
        }
    }).then(function (data) {
        console.log(data)
        $("#noteArea").val('');
        window.location = "/saved"
    })
})