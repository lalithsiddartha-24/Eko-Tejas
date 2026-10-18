function Contact()
{
    return(
            <section className = "bg-[#F4F7F3] px-6 py-24 md:px-10 lg:px-16">

            <div className  = "mx-auto max-w-7xl">
                <p className  = "text-xs tracking-[0.3em] font-bold text-[#79A88F]">Contact</p>
                <h3 className = " mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    Touch with
                    <span className = "block text-[#79A88F]">Us...</span>
                </h3>
                <div className=" mt-10 grid lg:grid-cols-2 gap-6">
                    <div className  = "group  rounded-3xl  border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:translate-y-2 hover:border-[#79A88F]/40 hover:bg-white/10 hover:shadow-2xl md:p-10">
                        <h3 className="text-2xl font-bold tracking-[0.12em] text-[#173C34]">
                        EKOTEJAS HEAD OFFICE
                        </h3>
                        <div className="mt-5 h-1 w-14 rounded-full bg-[#79A88F]" />
                        <p className="mt-6 max-w-lg text-base leading-7 text-[#52635D]">
                        1/137, Sreenilayam, KPS Complex,
                        <br />
                        Gooty – 515402,
                        <br />
                        Anantapur Dist, Andhra Pradesh
                        </p>
                        <div className="mt-8 space-y-2 text-base text- #52635D">
                        <p>info@ekotejas.in</p>
                        <p>admin@tejasevehicles.com</p>
                        </div>
                    </div>
                    <div className  = "group  rounded-3xl  border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:translate-y-2 hover:border-[#79A88F]/40 hover:bg-white/10 hover:shadow-2xl md:p-10">
                        <h3 className="text-2xl font-bold tracking-[0.12em] text-[#173C34]">
                        EKOTEJAS CORPORATE OFFICE
                        </h3>
                        <div className="mt-5 h-1 w-14 rounded-full bg-[#79A88F]" />
                        <p className="mt-6 max-w-lg text-base leading-7 text-[#52635D]">
                        #2, Tejashree Park Soc, S. NO 69, CTS No. 122/A
                        <br />
                        Gooty – 515402,
                        <br />
                        Erandawane, Pune – 411004, Maharashtra
                        </p>
                        <div className="mt-8 space-y-2 text-base text- #52635D">
                        <p>sales@ekotejas.in</p>
                        <p>sales.manager@ekotejas.in</p>
                        <p>director.sales@ekotejas.in</p>
                        </div>
                    </div>

                </div>
            </div>
            </section>
    )
}
export default Contact;