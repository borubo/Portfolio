"use strict";

{
  Vue.component("product", {
    template: `
     <div class="product">

        <div class="CtoB">
        <p v-if="!reviews.length" class="yet">No notes</p>
        <ul v-else>
        <li v-for="(review,index) in reviews" :key="index">
            <button v-on:click="splice(index)" class="DS">✖︎</button>
            <p>Title : {{ review.name }}</p>
            <p>Comment : {{ review.review }}</p>
          </li>
        </ul>
      </div>

         <product-review @review-submitted="addReview"></product-review>
      
      </div>
     `,
    data() {
      return {
        reviews: [],
      };
    },
    watch: {
      reviews: function () {
        localStorage.setItem("reviews", JSON.stringify(this.reviews));
      },
    },
    mounted: function () {
      this.reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    },
    methods: {
      addReview(productReview) {
        this.reviews.push(productReview);
      },
      splice: function (index) {
        if (confirm("are you sure?")) {
          this.reviews.splice(index, 1);
        }
      },
    },
  });

  Vue.component("product-review", {
    template: `
      <form class="review-form" @submit.prevent="onSubmit">
      
        <p class="error" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>

        <p>
          <label for="name">Title:</label>
          <input class="name" v-model="name">
        </p>
        
        <p>
          <label for="review">Comment</label><br>      
          <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
          <input type="submit" value="Submit" class="btn">  
        </p>    
      
    </form>
    `,
    data() {
      return {
        name: null,
        review: null,
        errors: [],
      };
    },
    methods: {
      onSubmit() {      
        if (this.name && this.review) {
          let productReview = {
            name: this.name,
            review: this.review,
          };
          this.$emit("review-submitted", productReview);
          this.name = null;
          this.review = null;
        } else {
          if (!this.name) alert('Please enter your name');
          if (!this.review) alert("Leave a comment");
        }
      },
    },
  });

  var app = new Vue({
    el: "#app",
  });

  Vue.config.devtools = true;
}
