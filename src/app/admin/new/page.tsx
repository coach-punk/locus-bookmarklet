import { RatingForm } from "@/components/RatingForm";

export default function NewRatingPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Add a rating</h1>
      <RatingForm mode="create" />
    </div>
  );
}
