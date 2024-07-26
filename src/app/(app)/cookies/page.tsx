import { cookiesPageData } from "@/data/data";

const page = () => {
  return (
    <section>
      <h2 className="my-2 text-5xl font-medium">Cookie Consent</h2>
      <p className="my-2 text-xl">
        This website uses cookies to enhance your browsing experience and
        provide personalized services. By continuing to browse this site, you
        agree to our use of cookies as described in this Cookie Policy.
      </p>
      {cookiesPageData.map((data, index) => (
        <div key={index}>
          <h3 className="my-6 text-3xl font-medium">
            {index + 1} {". "}
            {data.title}
          </h3>
          <p className="my-2 text-xl">{data.content}</p>
          {data.subContent && (
            <ul className="px-8">
              {data.subContent.map((subData, subIndex) => (
                <li key={subIndex} className="my-6 list-disc">
                  <h4 className="my-2 text-2xl font-medium">{subData.title}</h4>
                  <p className="my-2 text-xl">{subData.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
};

export default page;
