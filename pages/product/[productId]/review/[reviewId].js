import { useRouter } from "next/router";

function Review() {
  const router = useRouter();
  const { productId, ReviewId } = router.query;
  return (
    <h1>
      Review {ReviewId} for product {productId}
    </h1>
  );
}

export default Review;
