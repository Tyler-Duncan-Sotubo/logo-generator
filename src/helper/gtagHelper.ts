/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    gtag: any;
  }
}

export const pageview = (GA_MEASUREMENT_ID: string, url: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (window as any).gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};
