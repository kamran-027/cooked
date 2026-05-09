const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border/70 bg-card/85 py-4 backdrop-blur">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Cooked. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/80">Crafted by Kamran Khan</p>
      </div>
    </footer>
  );
};

export default Footer;
