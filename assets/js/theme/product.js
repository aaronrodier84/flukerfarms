/*
 Import all product specific js
 */
import $ from 'jquery';
import PageManager from '../page-manager';
import Review from './product/reviews';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import { classifyForm } from './common/form-utils';

export default class Product extends PageManager {
    constructor() {
        super();
        this.url = location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
    }

    before(next) {
        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', () => {
            if (this.url.indexOf('#writeReview') !== -1 && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        });

        next();
    }

    loaded(next) {
        let validator;

        // Init collapsible
        collapsibleFactory();

        this.productDetails = new ProductDetails($('.productView'), this.context, window.BCData.product_attributes);

        videoGallery();

        const $reviewForm = classifyForm('.writeReview-form');
        const review = new Review($reviewForm);

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = review.registerValidation();
            $('#modal-review-form').fadeIn(500);
            $( window ).scrollTop( 0 );
            return false;
        });

        $('#modal-review-form').on('click', '.modal-close', (e) => {
            $('#modal-review-form').fadeOut(500);
        });

        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }

            return false;
        });

        let ratingValue = parseInt($('#ratingValue').val());

        $('.productView-rating .rating-toggle').each(function(){
           if(ratingValue > 1){
               $(this).removeClass('icon-star-half-o').addClass('icon-star').removeClass('icon-star-o');
           }else if(ratingValue > 0){
               $(this).addClass('icon-star-half-o').removeClass('icon-star').removeClass('icon-star-o');
           }else{
               $(this).removeClass('icon-star-half-o').removeClass('icon-star').addClass('icon-star-o');
           }
           ratingValue = ratingValue - 1
        });

        next();
    }

    after(next) {
        this.productReviewHandler();

        next();
    }

    productReviewHandler() {
        if (this.url.indexOf('#write_review') !== -1) {
            this.$reviewLink.click();
        }
    }
}
