import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 md:py-28 bg-foreground text-background">
      <div className="container-main">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-body-sm uppercase tracking-[0.2em] text-background/60 mb-3 block">
            Stay Connected
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-medium mb-4">
            Join Our Community
          </h2>
          <p className="text-background/70 text-body mb-8">
            Subscribe to receive exclusive updates, early access to new collections, 
            and special offers crafted just for you.
          </p>

          {isSubmitted ? (
            <div className="animate-fade-up">
              <p className="text-lg text-primary">
                Thank you for subscribing!
              </p>
              <p className="text-background/60 text-sm mt-2">
                We'll be in touch soon with exclusive updates.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-transparent border border-background/30 text-background placeholder:text-background/40 focus:outline-none focus:border-background transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-background text-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
