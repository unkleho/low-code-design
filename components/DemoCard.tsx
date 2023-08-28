const DemoCard = ({ imageUrl, year, title, description }) => {
  return (
    <div className="relative block w-64 mr-8">
      <div className="relative">
        <img src={imageUrl} className="w-64 opacity-75" />
      </div>

      <div className="relative -mt-10">
        <p className="text-xs  ml-4 font-normal text-white">{year}</p>
        <h1 className="font-bold text-4xl  leading-tight mb-4 ml-4 text-teal-300">
          {title}
        </h1>
        <p className="mb-4 text-sm text-gray-100 ml-12 opacity-75">
          {description}
        </p>
      </div>
    </div>
  );
};
export default DemoCard;
