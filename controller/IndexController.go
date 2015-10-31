package controller

import (
	"github.com/jesusslim/page_runner"
	"github.com/jesusslim/slimgo"
	"github.com/jesusslim/slimmysql"
	"strconv"
	"strings"
)

type IndexController struct {
	slimgo.Controller
}

const example_url = "http://localhost:8888/teenager/"
const example_file = "/Applications/MAMP/htdocs/teenager/Application/"
const example_pool = "20"
const example_cookie = "PHPSESSID=c3146dcc95ba4e5992441718296aef1d"

func (this *IndexController) Index() {
	page := this.Context.Input.GetParam("page")
	pagesize := this.Context.Input.GetParam("pagesize")
	p, err := strconv.Atoi(page)
	if err != nil {
		p = 1
	}
	ps, err := strconv.Atoi(pagesize)
	if err != nil {
		ps = 20
	}
	sql, _ := slimmysql.NewSqlInstanceDefault()
	data, err := sql.Table("task").Order("create_time desc").Page(p, ps).Select()
	if err != nil {
		this.ServeJson(err.Error())
	}
	count, _ := sql.Clear().Table("task").Count("id")
	pages := int(count / ps)
	if count%ps > 0 {
		pages++
	}
	pageData := map[string]interface{}{
		"page":     p,
		"pagesize": ps,
		"pages":    pages,
	}
	this.Data["task"] = data
	this.Data["page"] = pageData
}

func (this *IndexController) Detail() {
	page := this.Context.Input.GetParam("page")
	pagesize := this.Context.Input.GetParam("pagesize")
	id := this.Context.Input.GetParam("task_id")
	p, err := strconv.Atoi(page)
	if err != nil {
		p = 1
	}
	ps, err := strconv.Atoi(pagesize)
	if err != nil {
		ps = 20
	}
	condition := map[string]interface{}{}
	task_id, err := strconv.Atoi(id)
	if err == nil {
		condition["task_id"] = task_id
		this.Data["task_id"] = task_id
	}
	sql, _ := slimmysql.NewSqlInstanceDefault()
	data, err := sql.Table("url").Where(condition).Order("url").Page(p, ps).Select()
	if err != nil {
		this.ServeJson(err.Error())
	}
	count, _ := sql.Clear().Table("url").Where(condition).Count("id")
	pages := int(count / ps)
	if count%ps > 0 {
		pages++
	}
	pageData := map[string]interface{}{
		"page":     p,
		"pagesize": ps,
		"pages":    pages,
	}
	this.Data["list"] = data
	this.Data["page"] = pageData
}

func (this *IndexController) Add() {
	this.Data["example"] = map[string]string{
		"file":   example_file,
		"url":    example_url,
		"pool":   example_pool,
		"cookie": example_cookie,
	}
}

func (this *IndexController) Insert() {
	path := this.Context.Input.GetParam("path")
	url := this.Context.Input.GetParam("url")
	module := this.Context.Input.GetParam("module")
	pool := this.Context.Input.GetInt("pool", 0)
	cookie := this.Context.Input.GetString("cookie")
	sql, _ := slimmysql.NewSqlInstanceDefault()
	if !strings.HasSuffix(path, "/") {
		path = path + "/"
	}
	pathScan := path
	if module != "" && module != "All" {
		pathScan = path + module
	}
	extErr := []string{
		"404",
		"error",
	}
	runner := page_runner.NewPageRunnerTP("0", pathScan, url, []string{path}, extErr, sql, pool, cookie, 0, module)
	go runner.Run()
	this.Redirect("/Index/index", 302)
}
