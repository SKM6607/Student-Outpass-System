package webapp.main.srmhosteloutpass;

import java.io.*;
import java.sql.*;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/applyOutpass")
public class ApplyOutpassServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        res.setContentType("text/plain");

        String registeredNumber = req.getParameter("registeredNumber");
        String name = req.getParameter("name");
        String reason = req.getParameter("reason");
        String fromDate = req.getParameter("fromDate");
        String toDate = req.getParameter("toDate");

        if (registeredNumber == null || registeredNumber.isEmpty()) {
            res.getWriter().print("missing_rId");
            return;
        }

        try (Connection conn = DBConnector.getConnection()) {

            // 1. Get student.id
            PreparedStatement findId = conn.prepareStatement(
                    "SELECT id FROM students WHERE registeredNumber = ?"
            );
            findId.setString(1, registeredNumber);

            ResultSet rs = findId.executeQuery();
            if (!rs.next()) {
                res.getWriter().print("student_not_found");
                return;
            }

            int studentId = rs.getInt("id");

            // 2. Insert outpass entry
            PreparedStatement ps = conn.prepareStatement(
                    "INSERT INTO outpass_requests (studentId, reason, from_date, to_date, name) " +
                            "VALUES (?, ?, ?, ?, ?)"
            );

            ps.setInt(1, studentId);
            ps.setString(2, reason);
            ps.setString(3, fromDate);
            ps.setString(4, toDate);
            ps.setString(5, name);

            int rows = ps.executeUpdate();

            if (rows > 0) {
                res.getWriter().print("success");
            } else {
                res.getWriter().print("fail");
            }

        } catch (Exception e) {
            e.printStackTrace();
            res.getWriter().print("error");
        }
    }
}
