export default function EmptyState({

  title="Nothing Found",

  description="No data available."

}){

  return(

    <div

      style={{

        background:"#f8fafc",

        border:"1px dashed #cbd5e1",

        borderRadius:"12px",

        padding:"40px",

        textAlign:"center"

      }}

    >

      <h2>

        {title}

      </h2>

      <p>

        {description}

      </p>

    </div>

  );

}