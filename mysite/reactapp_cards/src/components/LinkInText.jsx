import React from "react";
import { Link } from "react-router";

const LinkInText = ({children,...others}) => <Link className="underline hover:text-secondary transition-all" {...others}>
{children}
</Link>  

export default LinkInText;