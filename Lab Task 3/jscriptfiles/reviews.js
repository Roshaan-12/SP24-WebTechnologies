// Function to fetch and display food reviews
function displayReviews() {
    $.ajax({
      url: "https://65f695b741d90c1c5e0afd77.mockapi.io/restaurant/reviews/foodReviews",
      method: "GET",
      dataType: "json",
      success: function (data) {
        var reviewsList = $("#reviewsList");
        reviewsList.empty();
  
        data.forEach(function (review) {
          reviewsList.append(
            `<div class="mb-3">
              <p><strong>Food: </strong>${review.foodName}</p>
              <p><strong>Rating: </strong>${review.rating}</p>
              <p><strong>Review: </strong>${review.comments}</p>
              <button class="btn btn-danger btn-sm deleteReview" data-id="${review.id}">Delete</button>
            </div>
            <hr />`
          );
        });
      },
      error: function (error) {
        console.error("Error fetching reviews:", error);
      },
    });
  }
  
  // Function to submit a food review
  function submitReview(event) {
    event.preventDefault();
    var foodName = $("#foodName").val();
    var rating = $("#rating").val();
    var comments = $("#comments").val();
  
    $.ajax({
      url: "https://65f695b741d90c1c5e0afd77.mockapi.io/restaurant/reviews/foodReviews",
      method: "POST",
      data: {
        foodName: foodName,
        rating: rating,
        comments: comments
      },
      success: function () {
        displayReviews(); // Refresh the list after submitting a review
        $("#foodName").val(""); // Clear the foodName input
        $("#rating").val(""); // Clear the rating input
        $("#comments").val(""); // Clear the comments textarea
      },
      error: function (error) {
        console.error("Error submitting review:", error);
      },
    });
  }
  
  $(document).ready(function () {
    // Initial display of food reviews
    displayReviews();
  
    // Submit review form submission
    $("#reviewForm").submit(submitReview);
  
    // Delete review
    $(document).on("click", ".deleteReview", function () {
      var reviewId = $(this).data("id");
  
      $.ajax({
        url: `https://65f695b741d90c1c5e0afd77.mockapi.io/restaurant/reviews/foodReviews/${reviewId}`,
        method: "DELETE",
        success: function () {
          displayReviews(); // Refresh the list after deleting a review
        },
        error: function (error) {
          console.error("Error deleting review:", error);
        },
      });
    });
  
    // Clear form
    $("#clearForm").on("click", function () {
      $("#foodName").val("");
      $("#rating").val("");
      $("#comments").val("");
    });
  });
  