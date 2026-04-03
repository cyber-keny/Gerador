import Header from "../components/Header";
import Form from "../components/Form";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-2xl mx-auto p-6">
        <Form />
        <RecipeCard />
      </main>
    </div>
  );
}