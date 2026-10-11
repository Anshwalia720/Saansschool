// import AppShell from '../app-shell';
// export default function AboutPage() { return <AppShell />; }




// import { About } from '../views';

// export default function AboutPage() {
//   return <About />;
// }



import { PageIntro, Pill } from '../components/ui';

export default function AboutPage() {
  return (
    <>
      <PageIntro title="Every breath matters at school" text="SaansSchool helps school communities turn air quality information into thoughtful, practical action." />

      <div className="about-hero">
        <div>
          <Pill>BUILT FOR SCHOOL COMMUNITIES</Pill>
          <h2>From air quality numbers<br />to a plan everyone can use.</h2>
          <p>Air quality dashboards often stop at a number. Schools need a clearer next step: what might this mean for assembly, sports, and the children in their care?</p>
        </div>
        <div className="about-illustration">
          <div className="air-ring ring-one" /><div className="air-ring ring-two" /><span>☘</span>
        </div>
      </div>

      <div className="about-cards">
        <article className="panel"><span className="about-icon">♧</span><h2>Who it’s for</h2><p>Principals, teachers, and parents who need a calm, clear way to understand air quality at school.</p></article>
        <article className="panel"><span className="about-icon">↗</span><h2>What it helps solve</h2><p>Making everyday choices easier when air quality may affect outdoor activity and student comfort.</p></article>
        <article className="panel"><span className="about-icon">✳</span><h2>Why actions matter</h2><p>SaansSchool connects readings to practical options and simple explanations families can understand.</p></article>
      </div>

      <div className="note-box">All readings and forecasts in this prototype are demo data. SaansSchool is not a medical service or an official air-quality authority.</div>
    </>
  );
}