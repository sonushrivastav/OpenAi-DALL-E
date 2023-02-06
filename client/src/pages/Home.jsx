import React, { useState, useEffect } from "react";
import { Loader, Card, FormField } from "../components";


const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data?.map((post) => <Card key={ post._id} {...post} />)
  }

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{ title}</h2>
  )
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allposts, setAllPosts] = useState(null);
  const [searchtext, setSearchText] = useState("");
  const [searchResults,setSearchResults] =useState(null)
  const [searchTimeout,setSearchTimeout] =useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)

      try {
        const response = await fetch(`https://open-ai-dall-e-api.vercel.app/api/v1/post`, {
          method: "GET",
          headers: {
            "Content-Type":"application/json",
          },
        })

        if (response.ok) {
          const results = await response.json();

          setAllPosts(results.data.reverse())
        }
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])
  

  const handleSearchChange = (e) => {

    clearTimeout(searchTimeout)
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allposts?.filter((item) => item?.name?.toLowerCase().includes(searchtext.toLowerCase()) || item?.prompt?.toLowerCase().includes(searchtext.toLowerCase()))
  
        setSearchResults(searchResults)
      },500)

    )
}

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Browse through a collection of imaginative and visually stunning
          images generated by DALL -E AI
        </p>
      </div>

      <div className="mt-16">
        <FormField 
          labelName="Search Posts"
          type="text"
          name="text"
          placeholder="Search Posts"
          value={searchtext}
          handleChange={handleSearchChange}

        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
            <>
              {searchtext && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for <span className="text-[#222328]">{ searchtext}</span>
              </h2>
              )}
              <div className="grid lg:grid-cols-4 sm:grid-cols-3
              xs:grid-cols-2 grid-cols-1 gap-3
              ">
                {
                  searchtext ? (
                    <RenderCards
                      data={searchResults}
                      title="No search results found"
                    />
                  ) : (
                      <RenderCards
                      data={allposts}
                      title="No posts found"
                      />
                  )
               }
              </div>
            </>
        )}
      </div>
    </section>
  );
};

export default Home;
