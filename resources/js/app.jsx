import "./bootstrap";
import "../css/app.css";

const el = document.getElementById("app");

if (el) {
    import("react-dom/client").then(({ createRoot }) => {
        import("@inertiajs/react").then(({ createInertiaApp }) => {
            import("laravel-vite-plugin/inertia-helpers").then(
                ({ resolvePageComponent }) => {
                    createInertiaApp({
                        title: (title) => `${title} - NaviTree`,
                        resolve: (name) =>
                            resolvePageComponent(
                                `./Pages/${name}.jsx`,
                                import.meta.glob("./Pages/**/*.jsx", {
                                    eager: true,
                                })
                            ),
                        setup({ el: inertiaEl, App, props }) {
                            const root = createRoot(inertiaEl);
                            root.render(<App {...props} />);
                        },
                    });
                }
            );
        });
    });
}
