"use client"
import UploadForm from "@/components/UploadForm"
const page = () => {
    return (
        <main className='wrapper container'>

 <div className='mx-auto max-w-180
  space-y-10'>
      <section className='flex flex-col gap-5'>
        <h1  className='page-title-xl'>add new book</h1>
         <p className='subtitle'>
             upload a pdf file of your book and start chatting with it using voice. our ai will read the content of your book and answer your questions based on the information in the book.
         </p>

      </section>
      <UploadForm />
  </div>

        </main>
    )
}

export default page
