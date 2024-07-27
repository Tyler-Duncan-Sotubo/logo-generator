import { termsData } from "@/data/data";

const page = () => {
  return (
    <section>
      <h1 className="my-5 text-4xl font-medium">Terms of Service</h1>
      <ul>
        {termsData.map((term, index) => (
          <div key={index}>
            <li>
              <h3 className="my-5 text-2xl font-medium">{term.title}</h3>
            </li>
            <ul className="list-disc px-6">
              {term.content.map((subTerm, index) => (
                <li key={index}>
                  <p className="text-xl">{subTerm}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </section>
  );
};

export default page;
