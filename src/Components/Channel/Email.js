const EmailLogo = ({ className, color }) => {
	return (
		<svg className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512">
			<path d="M77.045 76.565h357.904v358.87H77.045z" fill="#f1f5f7" className="fill-f1f5f7"></path>
			<path d="m256.002 293.738 178.947 141.697v-279.74L256.002 293.738zm0 0" fill="#dce6ea" className="fill-dce6ea"></path>
			<path d="M449.861 76.565h-14.912L256.002 218.26 77.045 76.565H62.134c-24.693 0-44.737 20.094-44.737 44.858v269.152c0 24.759 20.044 44.859 44.737 44.859h14.911v-279.74l178.957 138.014 178.947-138.047v279.773h14.912c24.699 0 44.742-20.101 44.742-44.859V121.424c.001-24.764-20.042-44.859-44.742-44.859zm0 0" fill={color} className="fill-f84437"></path>
		</svg>
	)
}

export default EmailLogo