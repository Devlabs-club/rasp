const WrappedText = ({children, className, size}) => {
	return size === "large" ? 
	<span class={`xl:text-xl md:text-lg text-base w-max font-normal p-3 border border-dashed opacity-75 ${className}`}>{children}</span> 
	: 
	<span class="w-max font-semibold p-2 bg-gradient-to-r from-orange-500 to-orange-300 text-black">{children}</span>
}

export default WrappedText;

