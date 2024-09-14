const CenteredSection = ({children, className, id}) => {
    return (
        <section id={id} class={`container mx-auto relative border border-dashed border-gray-700 flex flex-col items-center ${className}`}>
            {children}
        </section>
    );
}

export default CenteredSection;