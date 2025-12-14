import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  //存放userName
  const [userName, setUserName] = useState("liwenchio");
  //存放專案
  const [repo, setRepo] = useState([]);
  //存放查詢條件
  const [searchData,setSearchData]= useState({});
  //存放分支commit
  const [branchs,setBranchs]=useState([]);

  //更新顯示的userName
  const handleUserNameChange = (e) => {
    let userName = e.target.value;
    setUserName(userName);
    //把userName 存到 searchData中
    const { value, name } = e.target;
    setSearchData({
      ...searchData,
      [name]: value,
    });
    //獲取使用者資料
    axios
      .get(`https://api.github.com/users/${userName}/repos?per_page=1000`)
      .then((res) => {
        // console.log(res);
        setRepo(res.data);
        console.log(res.data[0].owner.avatar_url);
        document.querySelector("#userAvatar").src=res.data[0].owner.avatar_url;
      })
      .catch((error) => {
        console.log(error);
        setRepo("");
      });
  };

  //report 選擇時更新 searchData
  const handleRepoChange=(e)=>{
    // console.log(e.target.value);
    const { value, name } = e.target;
    setSearchData({
      ...searchData,
      [name]: value,
    });
  }

  //送出追蹤
  const handleSearchData=(e)=>{
    e.preventDefault();
    console.log(searchData);
    //送出查詢
    axios
      .get(`https://api.github.com/repos/${searchData.username}/${searchData.repo}/branches`)
      .then((res) => {
        // console.log(res);
        // setRepo(res.data);
        //把分支丟到branchs中
        setBranchs(res.data);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setBranchs("");
      });
  }

  return (
    <>
      <header className="bg-dark text-white text-center py-3 mb-4">
        <h1 className="h3">Git 練功房 (Git Practice Tracker)</h1>
      </header>
      <main className="container">
        {/* <!-- TrackerForm --> */}
        <section className="mb-5">
          <h2 className="h5 mb-3">設定與認證</h2>
          <form className="row g-3">
            <div className="col-md-6">
              <label htmlFor="username" className="form-label">
                GitHub Username
              </label>
              <div className="input-group">
                {/* 使用者大頭貼 */}
                <span className="input-group-text bg-white">
                  <img
                    id="userAvatar"
                    src="https://plus.unsplash.com/premium_vector-1719858611039-66c134efa74d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVyc29ufGVufDB8fDB8fHww"
                    alt="User Avatar"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                  />
                </span>
                {/* 使用者名稱輸入框 */}
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="輸入 GitHub 帳號"
                  name="username"
                  value={userName}
                  onChange={handleUserNameChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="repo" className="form-label">
                選擇專案
              </label>
              <select
                className="form-select"
                id="repo"
                defaultValue="-- 請選擇專案 --"
                name="repo"
                onChange={handleRepoChange}
              >
                <option>-- 請選擇專案 --</option>
                {
                repo ? (
                  repo.map((item) => {
                    return <option key={item.id}>{item.name}</option>;
                  })
                ) : (
                  <></>
                )
                }
              </select>
            </div>

            <div className="col-12">
              <button className="btn btn-success w-100" onClick={handleSearchData}>
                開始追蹤
              </button>
            </div>
          </form>
        </section>

        {/* <!-- TrackerResults --> */}
        <section>
          <h2 className="h5 mb-3">追蹤結果</h2>
          <div className="alert alert-info" role="alert" >
            Branch 數量：{branchs.length}
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th scope="col">練習分支</th>
                  <th scope="col">開始時間</th>
                  <th scope="col">結束時間</th>
                  <th scope="col">完成時長</th>
                </tr>
              </thead>
              <tbody>
                {
                  branchs?(
                    branchs.map((branch)=>{
                      return <tr>
                      <td>{branch.name}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      </tr>
                    })
                    
                  ):(<></>)
                }

              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
