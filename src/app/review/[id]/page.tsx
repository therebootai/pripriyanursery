import ReviewEdit from "@/components/review/ReviewEdit";
import MainTemplates from "@/templates/MainTemplates";
import axios from "axios";

export default async function ReviewUpdate({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let review: {
    _id: string;
    rating: number;
    title: string;
    description: string;
    supporting_files: { url: string; public_id: string }[];
  } | null = null;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/review/${id}`,
    );

    review = data.review;
  } catch (error) {
    console.log(error);
  }

  if (!review)
    return (
      <MainTemplates>
        <div>Review not found</div>
      </MainTemplates>
    );

  return (
    <MainTemplates>
      <ReviewEdit review={review} />
    </MainTemplates>
  );
}
