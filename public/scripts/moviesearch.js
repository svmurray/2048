var app;

function Init() {
    app = new Vue({
        el: "#app",
        data: {
            movie_search: "",
            movie_type: "/Titles",
            movie_type_options: [
                {value: "/Titles", text: "Movie/TV Show Title"},
                {value: "/Names", text: "People"}
            ],
            search_results: []
        },
        computed: {
            input_placeholder: function() {
                if (this.movie_type === "/Titles") {
                    return "Search for a Movie/TV Show Title";
                }
                else {
                    return "Search for People";
                }
            }
        }
    });
}

document.onkeydown = function (event)
{
	if (event.keyCode == 13)
	{
		MovieSearch(event);
	}
}

function MovieSearch(event) {
    if (app.movie_search !== "") {
        $.get(app.movie_type, app.movie_search, (data) => {
            app.search_results = data;
        }, "json");
    }
}

function GetTitle(title)
{
	console.log(title);
	$.get(title, (data) =>
	{
		console.log(data);
	}, "json");
}

function GetName(name)
{
	console.log(name);
	$.get(name, (data) =>
	{
		console.log(data);
	}, "json");
}
