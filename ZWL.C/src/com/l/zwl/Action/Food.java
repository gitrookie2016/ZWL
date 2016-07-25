package com.l.zwl.Action;

import com.l.zwl.Util.FoodUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

/**
 * Created by Lix on 2016-7-25.
 */
public class Food {

    private static final String NOW_DATE =   new SimpleDateFormat("yyyyMMdd").format(new Date());

    public String setFoodMenu(Map<String, String> params){
        String reStr = "";
        String sfm = params.get("sfm");
        String usernum = params.get("usernum");

        if("835461226".equals(usernum) || "1666413216".equals(usernum)){

        }else{
            return "[CQ:face,id=160]提示：不好意思，你木有权限！";
        }

        String[] sfms = sfm.split("-");
        if(sfms.length == 2){
            FoodUtil foodUtil = new FoodUtil();
            JSONArray jsonArray = null;
            JSONObject json = new JSONObject();
            JSONObject setJson = new JSONObject();

            File file = new File(FoodUtil.path+"FoodMenu/FoodMenu"+NOW_DATE+".txt");
            if(file.exists()){
                String fm = foodUtil.ReaderFile("FoodMenu/FoodMenu"+NOW_DATE+".txt");
                JSONObject fmJson =JSONObject.fromObject(fm);
                if(fmJson != null && fmJson.size() > 0){

                    jsonArray = fmJson.getJSONObject("result").getJSONArray("foodMenuList");
                }else{
                    jsonArray = new JSONArray();
                }

            }else{
                jsonArray = new JSONArray();
            }

            json.put("FoodName", sfms[0]);
            json.put("FoodPrice", sfms[1]);
            int jas = jsonArray.size();
            for(int k = 0 ; k < jas ; k++){
                String jaStr = jsonArray.getJSONObject(k).getString("FoodName");
                if(jaStr != null &&sfms[0].equals(jaStr)){
                    jsonArray.remove(k);
                    if(jsonArray.size() == 0)break;
                    k = -1;
                    jas--;
                }
            }

            jsonArray.add(jsonArray.size(),json);


            setJson.put("foodMenuList",jsonArray);

            boolean flag = foodUtil.WriterFile(setJson.toString(),"FoodMenu","FoodMenu"+NOW_DATE+".txt");
            if(flag == true){
                reStr = "[CQ:face,id=160]提示：新增成功！";
            }else{
                reStr = "[CQ:face,id=160]提示：新增失败！";
            }

        }else{
            reStr = "[CQ:face,id=160]提示：正确新增菜单命令为【新增菜单 红烧鸡块-25元】";
        }
        return reStr;
    }

    public String getFoodMenu(Map<String, String> params){

        FoodUtil foodUtil = new FoodUtil();
        JSONArray jsonArray = null;
        File file = new File(FoodUtil.path+"FoodMenu/FoodMenu"+NOW_DATE+".txt");
        if(file.exists()){
            String fm = foodUtil.ReaderFile("FoodMenu/FoodMenu"+NOW_DATE+".txt");
            JSONObject fmJson =JSONObject.fromObject(fm);
            if(fmJson != null && fmJson.size() > 0){

                jsonArray = fmJson.getJSONObject("result").getJSONArray("foodMenuList");
            }
        }

        String Result = "★★★『今日菜单』★★★\r\n---------------------------";

        int jas = jsonArray.size();
        for(int j = 0 ; j < jas ; j++){
            Result += "\r\n〓" + jsonArray.getJSONObject(j).getString("FoodName") + " --->" + jsonArray.getJSONObject(j).getString("FoodPrice");
        }
        Result += "\r\n---------------------------\r\n★★★★★★★★★★★★★★";

        return Result;
    }

    public String orderFood(Map<String, String> params){

        Boolean flag = false;
        String sfm = params.get("sfm");

        String Result = "点餐失败！";
        FoodUtil foodUtil = new FoodUtil();
        JSONArray jsonArray = null;
        JSONArray reArray = null;
        String FoodPrice = "";

        JSONObject json = new JSONObject();
        JSONObject setJson = new JSONObject();

        File file = new File(FoodUtil.path+"FoodMenu/FoodMenu"+NOW_DATE+".txt");
        if(file.exists()){
            String fm = foodUtil.ReaderFile("FoodMenu/FoodMenu"+NOW_DATE+".txt");
            JSONObject fmJson =JSONObject.fromObject(fm);
            if(fmJson != null && fmJson.size() > 0){
                jsonArray = fmJson.getJSONObject("result").getJSONArray("foodMenuList");

                int jas = jsonArray.size();
                for(int j = 0 ; j < jas ; j++){
                    String jasStr = jsonArray.getJSONObject(j).getString("FoodName");
                    if(jasStr != null && jasStr.equals(sfm)){
                        FoodPrice = jsonArray.getJSONObject(j).getString("FoodPrice");
                    }
                }
            }else{
                return "[CQ:face,id=160]提示：暂无这道菜或今天没有菜单！";
            }
            if("".equals(FoodPrice)){
                return "[CQ:face,id=160]提示：暂无这道菜或今天没有菜单！";
            }
        }else{
            return "[CQ:face,id=160]提示：暂无这道菜或今天没有菜单！";
        }


        File OrderFoodfile = new File(FoodUtil.path+"OrderFood/OrderFood"+NOW_DATE+".txt");
        if(OrderFoodfile.exists()){
            String fm = foodUtil.ReaderFile("OrderFood/OrderFood"+NOW_DATE+".txt");
            JSONObject fmJson =JSONObject.fromObject(fm);
            if(fmJson != null && fmJson.size() > 0){
                reArray = fmJson.getJSONObject("result").getJSONArray("OrderFoodList");
            }else{
                reArray = new JSONArray();
            }
        }else{
            reArray = new JSONArray();
        }

        json.put("FoodName", params.get("sfm"));
        json.put("FoodPrice", FoodPrice);
        json.put("usernum", params.get("usernum"));
        json.put("userName", params.get("userName"));
        int jasT = reArray.size();

        for(int k = 0 ; k < jasT ; k++){
            if(reArray.size() == 0)break;
            String jaStr = reArray.getJSONObject(k).getString("usernum");
            if(jaStr != null &&params.get("usernum").equals(jaStr)){
                reArray.remove(k);
                k = -1;
                jasT--;
            }
        }

        reArray.add(reArray.size(),json);


        setJson.put("OrderFoodList",reArray);

        flag = foodUtil.WriterFile(setJson.toString(),"orderFood","orderFood"+NOW_DATE+".txt");
        if(flag == true){

            Result = "[CQ:face,id=160]提示 ：恭喜"+params.get("userName")+"("+params.get("usernum")+")点餐成功！原价为"+FoodPrice;
        }else{
            Result = "[CQ:face,id=160]提示：点餐失败！";
        }




        return Result;
    }

    public String getOrderFood(Map<String, String> params){

        FoodUtil foodUtil = new FoodUtil();
        JSONArray jsonArray = null;
        File file = new File(FoodUtil.path+"OrderFood/OrderFood"+NOW_DATE+".txt");
        if(file.exists()){
            String fm = foodUtil.ReaderFile("OrderFood/OrderFood"+NOW_DATE+".txt");
            JSONObject fmJson =JSONObject.fromObject(fm);
            if(fmJson != null && fmJson.size() > 0){

                jsonArray = fmJson.getJSONObject("result").getJSONArray("OrderFoodList");
            }
        }

        String Result = "★★★★★★★★★★★★★★『今日订单』★★★★★★★★★★★★★★\r\n-----------------------------------------------------------------------";

        int jas = jsonArray.size();
        for(int j = 0 ; j < jas ; j++){
            String userName = jsonArray.getJSONObject(j).getString("userName");
            if(userName == null || "".equals(userName)){
                userName = "";
            }

            String usernum = jsonArray.getJSONObject(j).getString("usernum");
            if(usernum == null || "".equals(usernum)){
                usernum = "";
            }

            String FoodName = jsonArray.getJSONObject(j).getString("FoodName");
            if(FoodName == null || "".equals(FoodName)){
                FoodName = "";
            }

            String FoodPrice = jsonArray.getJSONObject(j).getString("FoodPrice");
            if(FoodPrice == null || "".equals(FoodPrice)){
                FoodPrice = "暂无价格";
            }

            Result += "\r\n〓"+ userName+"("+usernum + ") --->" + FoodName + " --->" + FoodPrice;
        }
        Result += "\r\n-----------------------------------------------------------------------\r\n★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★";

        return Result;
    }

}
