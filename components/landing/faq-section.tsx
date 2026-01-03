import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "How does the land borrowing process work?",
        answer: "Landowners list their available plots. Farmers browse listings and can 'Request to Connect'. Once connected, both parties can discuss terms, sign a basic agreement (we provide templates!), and start farming."
    },
    {
        question: "Is it legal and safe?",
        answer: "Yes. We verify all users and provide standard legal templates for land usage agreements. We prioritize transparency and safety for both landowners and farmers."
    },
    {
        question: "Who can teach or learn on the platform?",
        answer: "Anyone! If you have experience, you can apply to become an instructor or mentor. If you want to learn, our courses are open to all skill levels."
    },
    {
        question: "Is there a fee to use Sajilo Kheti?",
        answer: "Browsing listings is free. We charge a small service fee only when a successful match is made or when you purchase a premium course."
    }
]

export function FAQSection() {
    return (
        <section id="faq" className="py-20 lg:py-32 bg-white">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-lg text-gray-600">
                        Got questions? We've got answers to help you get started.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                                <AccordionTrigger className="text-left text-lg font-medium text-gray-900 hover:text-emerald-600 py-6">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
