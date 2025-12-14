import { useState } from "react";
import axiox from "axios";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <header class="bg-dark text-white text-center py-3 mb-4">
        <h1 class="h3">Git 練功房 (Git Practice Tracker)</h1>
      </header>
      <main class="container">
        {/* <!-- TrackerForm --> */}
        <section class="mb-5">
          <h2 class="h5 mb-3">設定與認證</h2>
          <form class="row g-3">
            <div class="col-md-6">
              <label for="username" class="form-label">
                GitHub Username
              </label>
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="輸入 GitHub 帳號"
              />
            </div>
            <div class="col-md-6">
              <label for="repo" class="form-label">
                選擇專案
              </label>
              <select class="form-select" id="repo">
                <option selected>-- 請選擇專案 --</option>
                <option>專案 A</option>
                <option>專案 B</option>
              </select>
            </div>

            <div class="col-12">
              <button type="button" class="btn btn-success w-100">
                開始追蹤
              </button>
            </div>
          </form>
        </section>

        {/* <!-- TrackerResults --> */}
        <section>
          <h2 class="h5 mb-3">追蹤結果</h2>
          <div class="alert alert-info" role="alert">
            總練習次數：0
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <thead class="table-light">
                <tr>
                  <th scope="col">練習分支</th>
                  <th scope="col">開始時間</th>
                  <th scope="col">結束時間</th>
                  <th scope="col">完成時長</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>exercise/01-redux-thunk</td>
                  <td>2025-12-01 10:00</td>
                  <td>2025-12-01 15:30</td>
                  <td>5 小時 30 分鐘</td>
                </tr>
                <tr>
                  <td>exercise/02-validation</td>
                  <td>2025-12-02 09:00</td>
                  <td>2025-12-02 12:00</td>
                  <td>3 小時</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
