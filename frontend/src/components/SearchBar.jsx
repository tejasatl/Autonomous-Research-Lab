export default function SearchBar({

  value,

  onChange,

  onSearch,

  placeholder="Search..."

}){

  return(

    <div

      style={{

        display:"flex",

        gap:"10px",

        marginBottom:"25px"

      }}

    >

      <input

        value={value}

        onChange={onChange}

        placeholder={placeholder}

        onKeyDown={(e)=>{

          if(

            e.key==="Enter"

            &&

            onSearch

          ){

            onSearch();

          }

        }}

        style={{

          flex:1,

          padding:"14px",

          borderRadius:"8px",

          border:"1px solid #ddd"

        }}

      />

      <button

        onClick={onSearch}

        style={{

          padding:"14px 24px",

          background:"#2563eb",

          color:"white",

          border:"none",

          borderRadius:"8px",

          cursor:"pointer"

        }}

      >

        Search

      </button>

    </div>

  );

}