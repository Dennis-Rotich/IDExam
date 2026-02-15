interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  reverse?: boolean; // Option to flip image and text sides
}

export default function FeatureCard({ 
  title, 
  description, 
  imageSrc, 
  imageAlt = "Feature Preview",
  reverse = false 
}: FeatureCardProps) {
  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center py-12`}>
      {/* Text Content */}
      <div className="w-full lg:w-1/2 flex flex-col gap-2">
        <div className="min-h-[400px] w-full flex justify-center flex-col p-6 rounded-xl transition-all duration-300 text-left border border-transparent">
          <h3 className="text-4xl md:text-5xl font-bold py-6 leading-tight">
            {title}
          </h3>
          <div>
            <p className="max-w-xl text-slate-400 leading-relaxed text-xl">
              {description}
            </p>
          </div>
          <button className="mt-8 px-8 py-3 rounded-full border border-slate-700 text-sm font-bold hover:bg-white hover:text-black transition w-fit">
            Learn more
          </button>
        </div>
      </div>

      {/* Image / Illustration Content */}
      <div className="w-full lg:w-1/2 flex justify-center rounded-2xl overflow-hidden shadow-2xl">
        <div className="relative group">
          {/* Subtle Glow behind the SVG */}
          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full opacity-0 transition-opacity duration-700" />
          
          <img
            src={imageSrc}
            alt={imageAlt}
            width={600}
            height={600}
            className="relative z-10 h-auto object-contain transform transition-transform duration-700 group-hover:scale-[1.05]"
          />
        </div>
      </div>
    </div>
  );
}