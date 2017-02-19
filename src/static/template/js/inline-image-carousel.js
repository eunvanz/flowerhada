/* eslint-disable */

// if ($('.owl-carousel').length>0) {
//   $(".owl-carousel.carousel").owlCarousel({
//     items: 4,
//     pagination: false,
//     navigation: true,
//     navigationText: false,
//     autoHeight: true
//   });
//
//   var sync1 = $(".owl-carousel.content-slider-with-thumbs");
//   var sync2 = $(".owl-carousel.content-slider-thumbs");
//
//   sync1.owlCarousel({
//     singleItem : true,
//     slideSpeed : 1000,
//     navigation: true,
//     pagination:false,
//     afterAction : syncPosition,
//     responsiveRefreshRate : 200,
//   });
//
//   sync2.owlCarousel({
//     items : 4,
//     itemsDesktop : [1199,4],
//     itemsDesktopSmall : [979,4],
//     itemsTablet : [768,4],
//     itemsMobile : [479,4],
//     pagination: false,
//     responsiveRefreshRate : 100,
//     afterInit : function(el){
//       el.find(".owl-item").eq(0).addClass("synced");
//     }
//   });
//
//   function syncPosition(el){
//     var current = this.currentItem;
//     $(".owl-carousel.content-slider-thumbs")
//     .find(".owl-item")
//     .removeClass("synced")
//     .eq(current)
//     .addClass("synced")
//     if($(".owl-carousel.content-slider-thumbs").data("owlCarousel") !== undefined){
//       center(current)
//     }
//   }
//
//   $(".owl-carousel.content-slider-thumbs").on("click", ".owl-item", function(e){
//     e.preventDefault();
//     var number = $(this).data("owlItem");
//     sync1.trigger("owl.goTo",number);
//   });
//
//   function center(number){
//     var sync2visible = sync2.data("owlCarousel").owl.visibleItems;
//     var num = number;
//     var found = false;
//     for(var i in sync2visible){
//       if(num === sync2visible[i]){
//         var found = true;
//       }
//     }
//
//     if(found===false){
//       if(num>sync2visible[sync2visible.length-1]){
//         sync2.trigger("owl.goTo", num - sync2visible.length+2)
//       }else{
//         if(num - 1 === -1){
//           num = 0;
//         }
//         sync2.trigger("owl.goTo", num);
//       }
//     } else if(num === sync2visible[sync2visible.length-1]){
//       sync2.trigger("owl.goTo", sync2visible[1])
//     } else if(num === sync2visible[0]){
//       sync2.trigger("owl.goTo", num-1)
//     }
//
//   }
// };

if (($(".popup-img").length > 0)) {
  $(".popup-img").magnificPopup({
    type:"image",
    gallery: {
      enabled: true,
    }
  });
};
