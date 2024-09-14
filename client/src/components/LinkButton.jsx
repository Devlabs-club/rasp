const LinkButton = ({ children, link }) => {
	return (
		<a href={link || "https://asu.campuslabs.com/engage/organization/devlabs"} class="xl:text-xl md:text-lg text-base bg-white hover:bg-gray-300 transition-colors duration-200 ease-in-out font-semibold text-black w-max px-6 py-4">{children}</a>
	);
}

export default LinkButton;
