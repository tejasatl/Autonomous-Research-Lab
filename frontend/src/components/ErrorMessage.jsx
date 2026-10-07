export default function ErrorMessage({

  message="Something went wrong."

}){

  return(

    <div

      style={{

        background:"#fee2e2",

        color:"#991b1b",

        border:"1px solid #fecaca",

        borderRadius:"10px",

        padding:"18px",

        marginBottom:"20px"

      }}

    >

      ❌ {message}

    </div>

  );

}