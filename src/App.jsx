import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // axios.defaults.headers.common['Authorization'] = `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`;
  //存放userName
  const [userName, setUserName] = useState("");
  //存放專案
  const [repo, setRepo] = useState([]);
  //存放查詢條件
  const [searchData,setSearchData]= useState({});
  //存放分支commit
  const [branchs,setBranchs]=useState([]);
  // 保留這個陣列，它將儲存所有計算結果
  const [results, setResults] = useState([]);

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
        setRepo([]);
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
  // const handleSearchData=(e)=>{
  //   e.preventDefault();
  //   console.log(searchData);

  //   //送出查詢
  //   axios
  //     .get(`https://api.github.com/repos/${searchData.username}/${searchData.repo}/branches`)
  //     .then((res) => {
  //       // console.log(res);
  //       // setRepo(res.data);
  //       let branch=res.data.filter(item=>item.name.slice(0,3)==="pra");
  //       //把分支丟到branchs中
  //       setBranchs(branch);
  //       console.log(res);

  //       //抓分支的開始結束時間，丟到commitDetail
  //       branch.forEach((item)=>{
  //         axios.get(`https://api.github.com/repos/${searchData.username}/${searchData.repo}/commits?sha=${item.name}&per_page=1000`)
  //           .then((res)=>{
  //             // console.log(res);
  //             let datas=res.data;
  //             let startDT="";
  //             let endDT="";
  //             datas.forEach((data)=>{
  //               // console.log(data);
  //               let message=data.commit.message;
  //               let date=new Date(data.commit.committer.date);
  //               if(message.slice(0,5)==="START"){
  //                 startDT=date;
  //               }
  //               if(message.slice(0,4)==="DONE"){
  //                 endDT=date;
  //               }
                
  //             })
  //             console.log(`開始時間：${startDT}`);
  //             console.log(`結束時間：${endDT}`);

  //             const diffMs = endDT - startDT; // 直接相減也可以
  //             console.log(`間隔時間：${diffMs}`)
  //             const diffMinutes = Math.floor(diffMs / (1000 * 60));
  //             const hours = Math.floor(diffMinutes / 60);
  //             const minutes = diffMinutes % 60;
  //             const diffDT=`${hours} 小時 ${minutes} 分鐘`;
  //             console.log(`${hours} 小時 ${minutes} 分鐘`); // 5 小時 30 分鐘
  //             setCommitDetail({
  //               ...commitDetail,
  //               startDT:startDT.toLocaleString(),
  //               endDT:endDT.toLocaleString(),
  //               diffDT
  //             })
  //             console.log(commitDetail);
  //             // let date=res.data.commit.committer.date;
              
  //       })
  //           .catch((error)=>console.log(error))
  //       })
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setBranchs("");
  //     });
  // }
  // App.js (僅展示 handleSearchData 函式)

// 為了正確追蹤每個分支的結果，我們需要調整狀態：

// ... 其他狀態 (userName, repo, searchData, branchs)

// 送出追蹤
const handleSearchData = async (e) => {
  e.preventDefault();
  
  // 1. **數據獲取 (分支列表)**
  try {
    const branchesResponse = await axios.get(
      `https://api.github.com/repos/${searchData.username}/${searchData.repo}/branches`
    );
    
    // 篩選出符合規定的分支 (例如 'pra' 開頭)
    const allBranches = branchesResponse.data;
    const practiceBranches = allBranches.filter(item => item.name.slice(0, 3) === "pra");
    setBranchs(practiceBranches);

    if (practiceBranches.length === 0) {
      setResults([]);
      console.log("未找到符合 'pra' 開頭的練習分支。");
      return;
    }

    // 2. **並行處理所有分支的 Commit 請求 (核心優化)**
    // 使用 Promise.all 確保所有分支的計算都完成
    const calculationPromises = practiceBranches.map(async (branch) => {
      try {
        const commitResponse = await axios.get(
          `https://api.github.com/repos/${searchData.username}/${searchData.repo}/commits?sha=${branch.name}&per_page=1000`
        );
        
        // 3. **計算 T_start, T_end 與時長**
        const datas = commitResponse.data;
        let startDT = null; // 初始化為 null
        let endDT = null;   // 初始化為 null
        
        datas.forEach((data) => {
          const message = data.commit.message.toUpperCase(); // 轉大寫進行比對
          const date = new Date(data.commit.committer.date);

          // 尋找最早的 START: (您的程式碼邏輯)
          if (message.startsWith("START")) {
            if (startDT === null || date < startDT) {
                 startDT = date;
            }
          }
          
          // 尋找最晚的 DONE: (您的程式碼邏輯)
          if (message.startsWith("DONE")) {
             if (endDT === null || date > endDT) {
                 endDT = date;
            }
          }
        });
        
        // 處理時間計算
        if (!startDT || !endDT || endDT <= startDT) {
             return { name: branch.name, error: "無法確定有效的 START/DONE 時間。" };
        }

        const diffMs = endDT.getTime() - startDT.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        const diffDT = `${hours} 小時 ${minutes} 分鐘`;
        
        // 返回包含該分支所有結果的物件
        return {
          name: branch.name,
          startDT: startDT.toLocaleString(),
          endDT: endDT.toLocaleString(),
          diffDT: diffDT,
        };
        

      } catch (error) {
        console.error(`Error fetching commits for ${branch.name}:`, error);
        return { name: branch.name, error: "API 請求失敗。" };
      }
    });
    // 4. **等待所有計算完成，並更新單一狀態**
    const allResults = await Promise.all(calculationPromises);
    
    // 過濾掉錯誤的結果，只顯示成功的結果
    setResults(allResults.filter(r => !r.error)); 
    console.log("所有分支結果:", allResults.filter(r => !r.error));


  } catch (error) {
    console.error("Error fetching branches:", error);
    setBranchs([]);
    setResults([]);
    // 可以在這裡設定一個錯誤訊息狀態，在介面顯示
  }
};

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
                  results.length > 0?(
                    results.map((item) => {
                      // item 已經是包含所有時間數據的單獨結果物件
                      return (
                        <tr key={item.name}>
                          <td>{item.name}</td>
                          <td>{item.startDT || 'N/A'}</td>
                          <td>{item.endDT || 'N/A'}</td>
                          <td>{item.diffDT || '計算錯誤'}</td>
                        </tr>
                      );
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
