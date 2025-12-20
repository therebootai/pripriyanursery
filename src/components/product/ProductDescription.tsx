export default function ProductDescription() {
  return (
    <div className="mt-16">
      <h3 className="mb-4 text-xl font-bold">
        Product Description
      </h3>

      <div className="rounded border">
        <div className="grid grid-cols-2 border-b p-4 text-sm">
          <strong>Specification</strong>
          <strong>Description</strong>
        </div>

        <div className="grid grid-cols-2 border-b p-4 text-sm">
          <span>Plants text point</span>
          <span>Description...</span>
        </div>

        <div className="grid grid-cols-2 p-4 text-sm">
          <span>Plants text point</span>
          <span>Description...</span>
        </div>
      </div>

      <p className="mt-6 text-sm text-gray-600 leading-relaxed">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Plantae sed eget aliquet sed...
      </p>
    </div>
  )
}
